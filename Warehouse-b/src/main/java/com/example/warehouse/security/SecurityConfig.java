package com.example.warehouse.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.warehouse.entity.User;
import com.example.warehouse.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            System.err.println("SECURITY_CONFIG_INLINE_AUTH_INVOKED: " + username);
            User user = userRepository.searchUserByIdentifier(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities(user.getUserRole().name())
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationManager authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())

                // Authorization endpoints with public and private
                .authorizeHttpRequests(
                        auth -> auth.requestMatchers("/register")
                                .permitAll()
                                .anyRequest().authenticated())

                // type of authentication (HTTP Basic, Form Login, AuthOLogin etc.)
                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((req, res, auth) -> {
                            res.setStatus(HttpServletResponse.SC_OK);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"message\":\"Login Successful\", \"role\":\""
                                    + auth.getAuthorities().iterator().next().getAuthority() + "\"}");
                            res.getWriter().flush();
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"message\":\"Login Failed: " + ex.getMessage() + "\"}");
                            res.getWriter().flush();
                        })
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((req, res, auth) -> {
                            res.setStatus(HttpServletResponse.SC_OK);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"message\":\"Logout Successful\"}");
                            res.getWriter().flush();
                        })
                        .permitAll())
                // Building
                .build();
    }
}
