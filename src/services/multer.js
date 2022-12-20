import multer from "multer";

export const validationType = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  pdf: "application/pdf",
};
export const HME = (err, req, res, next) => {
  if (err) {
    res.json({ message: "multer error message", err :err.message});
    // next(new Error("multer error message", {cau}));
  } else {
    next();
  }
};

export function myMulter(acceptType) {
    const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (acceptType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("inavlid ", false);
    }
  }

  const uploads = multer({  fileFilter, storage });

  return uploads;
}
