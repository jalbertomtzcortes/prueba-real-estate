const openaiService = require("../services/openaiService");

exports.generatePresentation = async (req, res) => {

  try {

    const { city1, city2, growth } = req.body;

    const presentation = await openaiService.createPresentation(
      city1,
      city2,
      growth
    );

    res.json(presentation);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error generating presentation" });

  }

};