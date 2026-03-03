const projectService = require("../services/projectService");

async function listProjects(req, res) {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City query param is required" });
    }

    const projects = await projectService.getProjectsByCity(city);
    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching projects" });
  }
}

async function projectHistory(req, res) {
  try {
    const { id } = req.params;
    const { start, end } = req.query;

    if (start && end) {
      const data = await projectService.getProjectHistoryByDate(id, start, end);
      return res.json(data);
    }

    const history = await projectService.getProjectHistory(id);
    res.json(history);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching project history" });
  }
}

module.exports = {
  listProjects,
  projectHistory
};