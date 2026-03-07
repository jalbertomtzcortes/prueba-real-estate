const openaiService = require("../services/openaiService");

exports.generatePresentation = async (req, res) => {

  try {

    const presentation = await openaiService.createPresentation(req.body);

    res.json(presentation);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error generating presentation" });

  }

};
