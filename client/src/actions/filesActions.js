export const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const fetchFile = (bucketName, fileId) => {
  return {
    type: "REQUEST_FILE",
    route: `files/${bucketName}/${fileId}`,
    method: "GET",
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
      timeout: 2000,
    },
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000,
    },
  };
};

export const uploadFile = (blob, bucketName, name) => {
  let formData = new FormData();

  // if (Platform.OS === "web") {
  formData.append("file", blob);
  // } else {
  //   formData.append("file", new File(file.uri));
  //   //
  // }

  name && formData.append("name", name);

  return {
    type: "REQUEST_UPLOAD_FILE",
    route: `files/${bucketName}`,
    payload: formData,
    method: "POST",
    errorNotification: {
      message: "Cela n'a pas marché... Essayez de nouveau.",
      variant: "error",
      timeout: 2000,
    },
  };
};
