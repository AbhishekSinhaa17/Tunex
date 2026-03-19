import { Song } from "../models/song.model.js";

export const getHomeData = async (req, res, next) => {
  try {
    // We execute all 3 sample queries in parallel
    const [featuredSongs, madeForYouSongs, trendingSongs] = await Promise.all([
      Song.aggregate([
        { $sample: { size: 6 } },
        { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
      ]),
      Song.aggregate([
        { $sample: { size: 12 } },
        { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
      ]),
      Song.aggregate([
        { $sample: { size: 12 } },
        { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
      ]),
    ]);

    res.json({
      featuredSongs,
      madeForYouSongs,
      trendingSongs,
    });
  } catch (error) {
    next(error);
  }
};
