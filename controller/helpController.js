const { Help } = require("../model/index.model");

exports.addHelp = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "Invalid fields !!",
      });
    }

    const help = new Help();

    help.title = title;
    help.description = description;

    await help.save();

    return res.status(201).json({
      status: true,
      message: "help added successfully",
      help,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.getHelp = async (req, res) => {
  console.log("++++++++++++", req.query);
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const skip = page * limit;
    const search = req.query.search || ``;

    const fieldsToSearch = [`title`, `description`];

    const matchQuery = {
      $or: fieldsToSearch.map((field) => ({
        [field]: { $regex: search, $options: `i` },
      })),
    };

    const commonPipeline = [
      {
        $match: matchQuery,
      },
      //   {
      //     $project: {
      //       _id: 1,
      //       title: 1,
      //     },
      //   },
    ];

    const paginationPipeline = [
      ...commonPipeline,
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    ];

    const countPipeline = [...commonPipeline, { $count: `totalCount` }];

    const helpCount = await Help.aggregate(countPipeline);
    const totalhelps = helpCount.length > 0 ? helpCount[0].totalCount : 0;

    const help = await Help.aggregate(paginationPipeline);

    return res.status(200).json({
      status: true,
      message: "Helps fetched successfully",
      help,
      totalhelps,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.updateHelp = async (req, res) => {
  try {
    const { helpId } = req.query;
    const { title, description } = req.body;

    if (!helpId) {
      return res.status(400).json({
        status: false,
        message: "Invalid id !!",
      });
    }

    const help = await Help.findById(helpId);

    if (!help) {
      return res.status(404).json({
        status: false,
        message: "Help not found",
      });
    }
    help.title = title || help.title;
    help.description = description || help.description;
    await help.save();
    return res.status(200).json({
      status: true,
      message: "help updated successfully",
      help,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({});
  }
};

exports.deleteHelp = async (req, res) => {
  try {
    const { helpId } = req.query;

    if (!helpId) {
      return res.status(400).json({
        status: false,
        message: "Invalid helpId !!",
      });
    }

    const help = await Help.findById(helpId);

    console.log("helphelp++++++", help);

    if (!help) {
      return res.status(400).json({
        status: false,
        message: "Help not found !!",
      });
    }

    await help.deleteOne();

    return res.status(200).json({
      status: true,
      message: `${help?.title} Deleted successfully`,
      help,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
