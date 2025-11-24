import Institute from '../models/Institute.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

const getInstituteProfile = async (req, res) => {
  const institute = await Institute.findById(req.user.institute);
  res.status(StatusCodes.OK).json({ institute });
};

const updateInstituteProfile = async (req, res) => {
  const { name, tagline, phone, address, country, website } = req.body;

  if (!name || !tagline || !phone || !address || !country) {
    throw new BadRequestError('Please provide all values');
  }

  const institute = await Institute.findById(req.user.institute);

  if (req.file) {
    if (institute.logoPublicId) {
      await deleteFromCloudinary(institute.logoPublicId);
    }
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    institute.logoUrl = uploadResult.url;
    institute.logoPublicId = uploadResult.publicId;
  }

  institute.name = name;
  institute.tagline = tagline;
  institute.phone = phone;
  institute.address = address;
  institute.country = country;
  institute.website = website;

  await institute.save();

  res.status(StatusCodes.OK).json({ institute });
};

const deleteInstituteLogo = async (req, res) => {
  const institute = await Institute.findById(req.user.institute);

  if (!institute.logoPublicId) {
    throw new BadRequestError('No logo to delete');
  }

  await deleteFromCloudinary(institute.logoPublicId);

  institute.logoUrl = null;
  institute.logoPublicId = null;

  await institute.save();

  res.status(StatusCodes.OK).json({ institute });
};

export { getInstituteProfile, updateInstituteProfile, deleteInstituteLogo };