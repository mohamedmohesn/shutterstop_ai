const { ServerError } = require("../utils/cli");
exports.controller = (service) => async (req, res, next) => {
  const { error, status, message, meta, data, downloadFile } = await service(
    req,
    (host = req.get("Host"))
  );
  if (error) return next(new ServerError(error, status));
  return res.json({
    message: message,
    meta,
    data,
  });
};
