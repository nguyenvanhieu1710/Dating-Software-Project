const os = require('os');

const getLanIPv4Addresses = () => {
  try {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    Object.values(interfaces).forEach((ifaceList) => {
      (ifaceList || []).forEach((iface) => {
        if (iface && iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      });
    });
    // Remove duplicates just in case
    return Array.from(new Set(addresses));
  } catch (e) {
    return [];
  }
};

const startServer = async (server, env, serviceManager) => {
  try {
    await serviceManager.initializeServices();
    
    server.listen(env.PORT, env.HOST, () => {
      console.log('🚀 ========================================');
      console.log('🚀 DATING SOFTWARE BACKEND STARTED');
      console.log('🚀 ========================================');
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Server: http://${env.HOST}:${env.PORT}`);
      console.log(`📡 Socket.io: ws://${env.HOST}:${env.PORT}`);
      console.log(`🗄️  Database: ${env.summary.database}`);
      console.log(`🔴 Redis: ${env.summary.redis}`);
      console.log(`🌐 Frontend: ${env.summary.frontend}`);
      console.log(`📱 Mobile: ${env.frontend.mobileUrl}`);
      // Extra helpful URLs for Local and LAN access
      const localUrl = `http://localhost:${env.PORT}`;
      console.log(`🌐 Accessible URLs:`);
      console.log(`  • Local:   ${localUrl}/`);
      const lanIps = getLanIPv4Addresses();
      if (lanIps.length > 0) {
        lanIps.forEach((ip) => {
          console.log(`  ➜ Network: http://${ip}:${env.PORT}/`);
        });
      } else {
        console.log('  ➜ Network: (no LAN IPv4 detected)');
      }
      if (env.HOST && env.HOST !== '0.0.0.0' && env.HOST !== '::' && env.HOST !== 'localhost') {
        console.log(`
ℹ️  Listening on host ${env.HOST}. If devices cannot connect, set HOST=0.0.0.0 in your .env`);
      }
      console.log('🚀 ========================================');
      
      if (env.isDevelopment) {
        console.log('🔧 Development mode enabled');
        console.log(`🐛 Debug: ${env.development.debug}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

module.exports = { startServer };
