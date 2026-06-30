"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import type { Project } from "@/lib/state/slices/office/types";

export type OfficeProjectsCache = { projects: Project[] };

export function upsertProjectInList(
  current: OfficeProjectsCache | undefined,
  project: Project,
): OfficeProjectsCache | undefined {
  if (!current) return current;
  if (current.projects.some((item) => item.id === project.id)) {
    return {
      ...current,
      projects: current.projects.map((item) => (item.id === project.id ? project : item)),
    };
  }
  return { ...current, projects: [...current.projects, project] };
}

export function removeProjectFromList(
  current: OfficeProjectsCache | undefined,
  projectId: string,
): OfficeProjectsCache | undefined {
  if (!current) return current;
  return {
    ...current,
    projects: current.projects.filter((item) => item.id !== projectId),
  };
}

export function useSyncOfficeProjectCache() {
  const queryClient = useQueryClient();

  return useCallback(
    (project: Project) => {
      const projectsKey = qk.office.projects(project.workspaceId);
      queryClient.setQueryData(qk.office.project(project.id), project);
      queryClient.setQueryData<OfficeProjectsCache>(projectsKey, (current) =>
        upsertProjectInList(current, project),
      );
      queryClient.invalidateQueries({ exact: true, queryKey: projectsKey });
    },
    [queryClient],
  );
}
