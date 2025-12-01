# Nextcloud & OnlyOffice Setup Guide

## 1. Initial Nextcloud Setup
1.  Open [http://localhost:8080](http://localhost:8080) in your browser.
2.  **Create Admin Account**:
    *   Username: `admin`
    *   Password: `admin` (or your choice)
    *   **Database**: Leave as "SQLite" or choose "MySQL/MariaDB" if you want to use the DB container (User: `nextcloud`, Pass: `admin`, DB: `nextcloud`, Host: `db`). *SQLite is easiest for testing.*
3.  Click **Install**.

## 2. Install OnlyOffice Connector
1.  Log in as `admin`.
2.  Click the user icon (top right) -> **Apps**.
3.  In the search bar, type `ONLYOFFICE`.
4.  Click **Download and enable** for the "ONLYOFFICE" app.

## 3. Configure OnlyOffice
1.  Click the user icon -> **Administration settings**.
2.  In the left sidebar, scroll down to **ONLYOFFICE**.
3.  **ONLYOFFICE Docs address**: Enter `http://onlyoffice` (this is the internal Docker hostname).
4.  **Secret key**: Leave empty (since we disabled JWT in docker-compose for testing).
5.  Click **Save**.
6.  You should see a "Settings have been successfully updated" message.

## 4. Test
1.  Go to **Files** (folder icon top left).
2.  Click the **+** button.
3.  Select **New Document** (Word).
4.  It should open the OnlyOffice editor directly in your browser!
