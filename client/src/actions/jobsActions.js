export const createJob = (job) => {
  return {
    type: "REQUEST_CREATE_JOB",
    route: "jobs",
    payload: job,
    method: "POST",
    successNotification: {
      message: "Votre offre d'emploi a été créée",
      redirect: "MyJobs",
    },
    errorNotification: true,
  };
};

export const fetchJobs = () => {
  return {
    type: "REQUEST_JOBS",
    route: "jobs",
    method: "GET",
  };
};

export const fetchMyJobs = () => {
  return {
    type: "REQUEST_MY_JOBS",
    route: "jobs/me",
    method: "GET",
  };
};

export const updateJob = (job) => {
  return {
    type: "REQUEST_UPDATE_JOB",
    method: "PATCH",
    route: `jobs/${job._id}`,
    payload: job,
    successNotification: {
      message: "Votre offre d'emploi a été mise à jour.",
      variant: "success",
      redirect: "MyJobs",
      timeout: 1000,
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000,
    },
  };
};

export const deleteJob = (id) => {
  return {
    type: "REQUEST_DELETE_JOB",
    method: "DELETE",
    route: `jobs/${id}`,
    successNotification: {
      message: "Offre d'emploi supprimée.",
      variant: "success",
      redirect: "MyJobs",
      timeout: 1000,
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000,
    },
  };
};
