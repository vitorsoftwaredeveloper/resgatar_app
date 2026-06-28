jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { api } from "@/services/api";
import { CommitmentService } from "@/services/CommitmentService";
import { ICommitment, ICommitmentInput } from "@/types/Commitment";

const sample: ICommitment = {
  id: "c1",
  title: "Grupo de oração",
  day: "Quarta",
  time: "19h",
  location: "Capela",
  repeat: "weekly",
  weekday: 3,
  ordinal: null,
  date: null,
};

describe("CommitmentService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("faz GET /commitments e retorna data.data", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { data: [sample] } });

      const result = await CommitmentService.list();

      expect(api.get).toHaveBeenCalledWith("/commitments");
      expect(result).toEqual([sample]);
    });

    it("retorna [] quando a resposta não traz data", async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: {} });

      const result = await CommitmentService.list();

      expect(result).toEqual([]);
    });

    it("propaga erro quando a requisição falha", async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error("network"));

      await expect(CommitmentService.list()).rejects.toThrow("network");
    });
  });

  describe("create", () => {
    it("faz POST /commitments com o payload e retorna o criado", async () => {
      const input: ICommitmentInput = {
        title: "Missa",
        time: "19h",
        location: "Igreja",
        repeat: "weekly",
        weekday: 0,
      };
      (api.post as jest.Mock).mockResolvedValue({ data: { data: sample } });

      const result = await CommitmentService.create(input);

      expect(api.post).toHaveBeenCalledWith("/commitments", input);
      expect(result).toEqual(sample);
    });

    it("propaga erro", async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error("400"));
      await expect(
        CommitmentService.create({
          title: "x",
          time: "9h",
          location: "y",
          repeat: "weekly",
          weekday: 1,
        }),
      ).rejects.toThrow("400");
    });
  });

  describe("update", () => {
    it("faz PUT /commitments/{id} com o payload", async () => {
      const input: ICommitmentInput = {
        title: "Missa editada",
        time: "20h",
        location: "Matriz",
        repeat: "monthly",
        weekday: 0,
        ordinal: 2,
      };
      (api.put as jest.Mock).mockResolvedValue({ data: { data: sample } });

      const result = await CommitmentService.update("c1", input);

      expect(api.put).toHaveBeenCalledWith("/commitments/c1", input);
      expect(result).toEqual(sample);
    });
  });

  describe("saveOrder", () => {
    it("faz PUT /commitments/order com a lista de ids na ordem", async () => {
      (api.put as jest.Mock).mockResolvedValue({});

      await CommitmentService.saveOrder([
        { ...sample, id: "a" },
        { ...sample, id: "b" },
        { ...sample, id: "c" },
      ]);

      expect(api.put).toHaveBeenCalledWith("/commitments/order", {
        ids: ["a", "b", "c"],
      });
    });

    it("propaga erro de reordenação", async () => {
      (api.put as jest.Mock).mockRejectedValue(new Error("order mismatch"));
      await expect(CommitmentService.saveOrder([sample])).rejects.toThrow(
        "order mismatch",
      );
    });
  });

  describe("remove", () => {
    it("faz DELETE /commitments/{id}", async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      await CommitmentService.remove("c1");

      expect(api.delete).toHaveBeenCalledWith("/commitments/c1");
    });

    it("propaga erro", async () => {
      (api.delete as jest.Mock).mockRejectedValue(new Error("not found"));
      await expect(CommitmentService.remove("c1")).rejects.toThrow("not found");
    });
  });
});
