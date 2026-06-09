IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'fleetcore')
BEGIN
    CREATE DATABASE [fleetcore];
END;
