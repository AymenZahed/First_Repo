const QRCode = require('qrcode');

exports.generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });
    return qrCode;
  } catch (error) {
    console.error(`Error generating QR code: ${error.message}`);
    throw error;
  }
};

exports.generateMissionQRCode = async (missionId) => {
  const data = JSON.stringify({
    type: 'mission',
    id: missionId,
    timestamp: Date.now()
  });
  return await this.generateQRCode(data);
};

module.exports = exports;
