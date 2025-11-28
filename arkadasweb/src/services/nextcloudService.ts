import { createClient, WebDAVClient, FileStat } from "webdav";

const NEXTCLOUD_URL = process.env.NEXT_PUBLIC_NEXTCLOUD_URL || "";
const NEXTCLOUD_USER = process.env.NEXTCLOUD_USER || "";
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD || "";

let client: WebDAVClient | null = null;

export const getNextcloudClient = () => {
    if (!client && NEXTCLOUD_URL && NEXTCLOUD_USER && NEXTCLOUD_PASSWORD) {
        client = createClient(NEXTCLOUD_URL, {
            username: NEXTCLOUD_USER,
            password: NEXTCLOUD_PASSWORD,
        });
    }
    return client;
};

export const nextcloudService = {
    getDirectoryContents: async (username: string, path: string = ""): Promise<FileStat[]> => {
        const client = getNextcloudClient();
        if (!client) {
            console.warn("Nextcloud credentials not configured.");
            return [];
        }

        const userRoot = `/ArkadasUsers/${username}`;
        let fullPath = path;
        
        // If path is empty, use userRoot
        if (!path) {
            fullPath = userRoot;
        } 
        // If path doesn't start with userRoot, append it (handling leading slash)
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            fullPath = `${userRoot}${safePath}`;
        }

        try {
            // Check if user root exists, if not create it (only if at root)
            if (fullPath === userRoot) {
                const exists = await client.exists(userRoot);
                if (!exists) {
                    if (await client.exists("/ArkadasUsers") === false) {
                        await client.createDirectory("/ArkadasUsers");
                    }
                    await client.createDirectory(userRoot);
                }
            }

            const contents = await client.getDirectoryContents(fullPath);
            return contents as FileStat[];
        } catch (error) {
            console.error(`Error fetching directory contents for ${username} at ${fullPath}:`, error);
            throw error;
        }
    },

    getFileUrl: (username: string, path: string) => {
        const userRoot = `/ArkadasUsers/${username}`;
        let fullPath = path;
        if (!path) fullPath = userRoot;
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            fullPath = `${userRoot}${safePath}`;
        }
        return `${NEXTCLOUD_URL}/remote.php/dav/files/${NEXTCLOUD_USER}${fullPath}`;
    },
    
    createDirectory: async (username: string, path: string) => {
        const client = getNextcloudClient();
        if (!client) return;
        
        const userRoot = `/ArkadasUsers/${username}`;
        let fullPath = path;
        if (!path) fullPath = userRoot;
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            fullPath = `${userRoot}${safePath}`;
        }
        
        await client.createDirectory(fullPath);
    },

    uploadFile: async (username: string, path: string, buffer: Buffer, filename: string) => {
        const client = getNextcloudClient();
        if (!client) return;
        
        const userRoot = `/ArkadasUsers/${username}`;
        let dirPath = path;
        if (!path) dirPath = userRoot;
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            dirPath = `${userRoot}${safePath}`;
        }
        
        // Ensure dirPath ends with /
        if (!dirPath.endsWith('/')) dirPath += '/';
        
        const fullPath = `${dirPath}${filename}`;
        
        await client.putFileContents(fullPath, buffer);
    },

    getFileStream: (username: string, path: string, filename: string) => {
        const client = getNextcloudClient();
        if (!client) throw new Error("Nextcloud client not initialized");
        
        const userRoot = `/ArkadasUsers/${username}`;
        let dirPath = path;
        if (!path) dirPath = userRoot;
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            dirPath = `${userRoot}${safePath}`;
        }

        // Ensure dirPath ends with /
        if (!dirPath.endsWith('/')) dirPath += '/';
        
        const fullPath = `${dirPath}${filename}`;

        return client.createReadStream(fullPath);
    },

    deleteFile: async (username: string, path: string, filename: string) => {
        const client = getNextcloudClient();
        if (!client) return;
        
        const userRoot = `/ArkadasUsers/${username}`;
        let dirPath = path;
        if (!path) dirPath = userRoot;
        else if (!path.startsWith(userRoot)) {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            dirPath = `${userRoot}${safePath}`;
        }

        // Ensure dirPath ends with /
        if (!dirPath.endsWith('/')) dirPath += '/';
        
        const fullPath = `${dirPath}${filename}`;
        
        await client.deleteFile(fullPath);
    },

    createUser: async (userid: string, password: string, email?: string) => {
        // Using OCS Provisioning API
        // POST /ocs/v1.php/cloud/users
        if (!NEXTCLOUD_URL || !NEXTCLOUD_USER || !NEXTCLOUD_PASSWORD) {
            console.warn("Nextcloud credentials not configured.");
            return;
        }

        const body = new URLSearchParams();
        body.append('userid', userid);
        body.append('password', password);
        if (email) body.append('email', email);

        try {
            const response = await fetch(`${NEXTCLOUD_URL}/ocs/v1.php/cloud/users`, {
                method: 'POST',
                headers: {
                    'OCS-APIRequest': 'true',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${NEXTCLOUD_USER}:${NEXTCLOUD_PASSWORD}`).toString('base64')
                },
                body: body
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Nextcloud create user failed:", text);
                // Don't throw if user already exists, maybe?
                // But for now let's log.
            } else {
                console.log(`Nextcloud user ${userid} created.`);
            }
        } catch (error) {
            console.error("Error creating Nextcloud user:", error);
        }
    }
};
