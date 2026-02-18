import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CamperCard from "@/components/CamperCard";

interface Camper {
  id: number;
  name: string;
  username: string;
  emoji: string;
}

const CAMPER_EMOJIS = ["🦕", "🦖", "🦴", "🌋"];

function mapUserToCamper(user: { id: number; name: string; username: string }, index: number): Camper {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    emoji: CAMPER_EMOJIS[index % CAMPER_EMOJIS.length],
  };
}

const Index = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async ({ id, username }: { id: number; username: string }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update username");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const campers = useMemo(() => users.map(mapUserToCamper), [users]);

  const updateUsername = (id: number, newUsername: string) => {
    updateUsernameMutation.mutate({ id, username: newUsername });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-10 text-center">
        <p className="text-4xl mb-2">🦕</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Dino Discovery Camp
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Summer 2026 · Enrolled Campers
        </p>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 space-y-4">
        {isLoading && (
          <p className="text-center text-muted-foreground">Loading campers…</p>
        )}
        {error && (
          <p className="text-center text-destructive">
            Could not load roster. Is the backend running on port 3000?
          </p>
        )}
        {!isLoading && !error && campers.map((c) => (
          <CamperCard
            key={c.id}
            name={c.name}
            username={c.username}
            emoji={c.emoji}
            onSave={(newUsername) => updateUsername(c.id, newUsername)}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
