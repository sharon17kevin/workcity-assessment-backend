const request = require("supertest");
const { Project, validateProject } = require("../model/project");
const app = require("../index");

jest.mock("../model/project.js");

describe("Project Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /projects", () => {
    it("should create a new project and return 200", async () => {
      const projectData = {
        name: "Project Alpha",
        description: "A sample project",
        status: "Active",
        priority: "High",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        progress: 10,
        teamMembers: ["user1", "user2"],
        budget: 10000,
        tag: "Development",
      };

      validateProject.mockReturnValue({ error: null });
      Project.prototype.save = jest
        .fn()
        .mockResolvedValue({ _id: "123", ...projectData });

      const res = await request(app).post("/projects").send(projectData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: "123", ...projectData });
      expect(Project.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if validation fails", async () => {
      validateProject.mockReturnValue({
        error: { details: [{ message: "Invalid name" }] },
      });

      const res = await request(app).post("/projects").send({ name: "" });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid name");
    });
  });

  describe("PUT /projects", () => {
    it("should update a project and return 200", async () => {
      const projectData = {
        name: "Project Beta",
        description: "Updated project",
        status: "In Progress",
        priority: "Medium",
        startDate: "2025-02-01",
        endDate: "2025-11-30",
        progress: 50,
        teamMembers: ["user3", "user4"],
        budget: 15000,
        tag: ["Research", "Development"],
      };

      validateProject.mockReturnValue({ error: null });
      Project.findByIdAndUpdate.mockResolvedValue({
        _id: "123",
        ...projectData,
      });

      const res = await request(app).put("/projects?id=123").send(projectData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id: "123", ...projectData });
      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        projectData,
        { new: true }
      );
    });

    it("should return 404 if project not found", async () => {
      validateProject.mockReturnValue({ error: null });
      Project.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put("/projects?id=123")
        .send({ name: "Project Beta" });

      expect(res.status).toBe(404);
      expect(res.text).toBe("The project with the given ID was not found.");
    });
  });

  describe("DELETE /projects", () => {
    it("should delete a project and return 200", async () => {
      const projectData = { _id: "123", name: "Project Alpha" };
      Project.findByIdAndRemove.mockResolvedValue(projectData);

      const res = await request(app).delete("/projects?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(projectData);
      expect(Project.findByIdAndRemove).toHaveBeenCalledWith("123");
    });

    it("should return 404 if project not found", async () => {
      Project.findByIdAndRemove.mockResolvedValue(null);

      const res = await request(app).delete("/projects?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The project with the given ID was not found.");
    });
  });

  describe("GET /projects", () => {
    it("should return a single project by ID", async () => {
      const projectData = { _id: "123", name: "Project Alpha" };
      Project.findById.mockResolvedValue(projectData);

      const res = await request(app).get("/projects?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(projectData);
      expect(Project.findById).toHaveBeenCalledWith("123");
    });

    it("should return all projects sorted by name", async () => {
      const projects = [{ name: "Project A" }, { name: "Project B" }];
      Project.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(projects),
      });

      const res = await request(app).get("/projects");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(projects);
      expect(Project.find).toHaveBeenCalled();
    });

    it("should return 404 if project not found by ID", async () => {
      Project.findById.mockResolvedValue(null);

      const res = await request(app).get("/projects?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The project with the given ID was not found.");
    });
  });

  describe("GET /projects/one", () => {
    it("should return a single project by ID", async () => {
      const projectData = [{ _id: "123", name: "Project Alpha" }];
      Project.find.mockResolvedValue(projectData);

      const res = await request(app).get("/projects/one?id=123");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(projectData);
      expect(Project.find).toHaveBeenCalledWith({ _id: { $in: "123" } });
    });

    it("should return all projects sorted by name", async () => {
      const projects = [{ name: "Project A" }, { name: "Project B" }];
      Project.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(projects),
      });

      const res = await request(app).get("/projects/one");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(projects);
      expect(Project.find).toHaveBeenCalled();
    });

    it("should return 404 if project not found by ID", async () => {
      Project.find.mockResolvedValue(null);

      const res = await request(app).get("/projects/one?id=123");

      expect(res.status).toBe(404);
      expect(res.text).toBe("The project with the given ID was not found.");
    });
  });
});
