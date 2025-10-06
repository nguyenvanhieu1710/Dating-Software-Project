const os = require("os");

const getLanIPv4Addresses = () => {
  try {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    Object.values(interfaces).forEach((ifaceList) => {
      (ifaceList || []).forEach((iface) => {
        if (iface && iface.family === "IPv4" && !iface.internal) {
          addresses.push(iface.address);
        }
      });
    });
    return Array.from(new Set(addresses));
  } catch {
    return [];
  }
};

const startServer = async (server, env) => {
  try {
    server.listen(env.PORT, env.HOST, () => {
      console.log("🚀 ========================================");
      console.log("🚀 DATING SOFTWARE BACKEND STARTED");
      console.log("🚀 ========================================");
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Server: http://${env.HOST}:${env.PORT}`);
      console.log(`📡 Socket.io: ws://${env.HOST}:${env.PORT}`);
      if (env.database) {
        console.log(
          `🗄️  Database: ${env.database.host}:${env.database.port}/${env.database.name}`
        );
      }
      const localUrl = `http://localhost:${env.PORT}`;
      console.log("🌐 Accessible URLs:");
      console.log(`  • Local:   ${localUrl}/`);

      const lanIps = getLanIPv4Addresses();
      if (lanIps.length > 0) {
        lanIps.forEach((ip) => {
          console.log(`  ➜ Network: http://${ip}:${env.PORT}/`);
        });
      }

      console.log("🚀 ========================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

module.exports = { startServer };
