import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";

const addToActivity = async (req, res) => {
  const { user_id, meetingCode } = req.body;

  if (!user_id || !meetingCode) {
    return res.status(400).json({ message: "Missing user_id or meetingCode" });
  }

  try {
    const meeting = new Meeting({
      user_id,
      meetingCode,
    });

    await meeting.save();

    return res.status(httpStatus.CREATED).json({ message: "Meeting saved!" });
  } catch (e) {
    return res.status(500).json({ message: `Error: ${e}` });
  }
};

const getAllActivity = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id" });
  }

  try {
    const meetings = await Meeting.find({ user_id }).sort({ date: -1 });
    return res.status(httpStatus.OK).json({ meetings });
  } catch (e) {
    return res.status(500).json({ message: `Error: ${e}` });
  }
};

export { addToActivity, getAllActivity };
