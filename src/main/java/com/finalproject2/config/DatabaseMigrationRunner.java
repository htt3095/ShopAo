package com.finalproject2.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseMigrationRunner {

    @Bean
    public CommandLineRunner runDatabaseMigrations(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Drop the old check constraint if it exists to prevent 500 errors on return flow
                jdbcTemplate.execute(
                    "IF OBJECT_ID('CK_Orders_Status', 'C') IS NOT NULL " +
                    "ALTER TABLE Orders DROP CONSTRAINT CK_Orders_Status"
                );
                
                // Add the updated check constraint that includes RETURN_APPROVED
                jdbcTemplate.execute(
                    "ALTER TABLE Orders ADD CONSTRAINT CK_Orders_Status CHECK " +
                    "([status] IN ('DELIVERED', 'DELIVERING', 'PROCESSING', 'PENDING', 'LOST', " +
                    "'DAMAGED', 'RETURNED', 'RETURNING', 'RETURN_REQUEST', 'RETURN_APPROVED', " +
                    "'CANCELLED', 'SUCCESS', 'SHIPPING', 'CONFIRMED', 'NEW'))"
                );
                System.out.println("✅ [Migration] Successfully updated CK_Orders_Status constraint to include RETURN_APPROVED");
            } catch (Exception e) {
                System.err.println("⚠️ [Migration] Failed to update CK_Orders_Status. It may have already been updated or doesn't exist.");
            }
        };
    }
}
