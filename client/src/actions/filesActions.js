export const fetchFile = (bucketName, fileId) => {
  return {
    type: "REQUEST_FILE",
    route: `files/${bucketName}/${fileId}`,
    method: "GET"
  };
};

export const deleteFile = (bucketName, fileId) => {
  return {
    type: "REQUEST_DELETE_FILE",
    route: `files/${bucketName}/${fileId}`,
    method: "DELETE",
    successNotification: {
      message: "Votre document a bien été supprimé de la base de données.",
      variant: "success",
      timeout: 2000
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000
    }
  };
};

export const uploadFile = (file, bucketName) => {
  let formData = new FormData();
  let temp = file.uri.split("/");
  formData.append(bucketName, {
    uri: file.uri,
    name: temp[temp.length - 1],
    type: "image/jpeg"
  });

  return {
    type: "REQUEST_UPLOAD_FILE",
    route: `files`,
    payload: formData,
    method: "POST",
    successNotification: {
      message: "Votre document a bien été enregistré dans la base de données.",
      variant: "success",
      redirect: "Profile",
      timeout: 2000
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000
    }
  };
};
