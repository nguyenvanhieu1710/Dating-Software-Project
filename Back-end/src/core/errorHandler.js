const setupErrorHandler = (app) => {
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON payload'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });
};

module.exports = { setupErrorHandler };
