import axios from "axios";


export async function makeRequest(path, method, data, isFileUpload = false) {
  if (method === "get") {
    try {
      const response = await axios.get(path);

      if (response.status === 200) {
        return response.data;
      } else {
        throw {
          code: response.status,
          reason: response.statusText,
        };
      }
    } catch (error) {
      console.error(`Request to ${path} failed.`, error);
      throw extractError(error);
    }
  }

  try {
    const config = {
      method: method,
      url: path,
    };

    if (isFileUpload) {
      // For file uploads, use FormData and set headers for multipart/form-data
      const formData = new FormData();

      // Append all fields to FormData
      for (const key in data) {
        if (key === "photo" && data[key]) {
          // Append the file
          formData.append(key, {
            uri: data[key].uri,
            name: data[key].name,
            type: data[key].type,
          });
        } else {
          // Append other fields
          formData.append(key, data[key]);
        }
      }

      config.data = formData;
      config.headers = {
        "Content-Type": "multipart/form-data",
      };
    } else {
      // For non-file uploads, use JSON
      config.headers = {
        "Content-Type": "application/json",
      };
      config.data = data;
    }

    const response = await axios(config);

    if (response.status === 200) {
      return response.data;
    } else {
      throw {
        code: response.status,
        reason: response.statusText,
      };
    }
  } catch (error) {
    console.error(`Request to ${path} failed.`, error);
    throw extractError(error);
  }
}

export async function makeRequestWithSpinner(
  showSpinner,
  hideSpinner,
  path,
  method,
  data,
  headers
) {
  showSpinner();

  if (method === "get") {
    try {
      const response = await axios.get(path, { headers: headers });
      if (response.status === 200) {
        hideSpinner();
        return response.data;
      } else {
        throw {
          code: response.status,
          reason: response.statusText,
        };
      }
    } catch (error) {
      hideSpinner();
      console.error(`Request to ${path} failed.`, error);
      throw extractError(error);
    }
  }

  try {
    const response = await axios({
      method: method,
      url: path,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      data: data,
    });

    if (response.status === 200) {
      hideSpinner();
      return response.data;
    } else {
      throw {
        code: response.status,
        reason: response.statusText,
      };
    }
  } catch (error) {
    hideSpinner();
    console.error(`Request to ${path} failed.`, error);
    throw extractError(error);
  }
}

// Helper function to extract error messages
function extractError(error) {
  if (error.response) {
    // API responded with an error (e.g., 400, 401, 500)
    return {
      code: error.response.status,
      msg: error.response.data?.msg || "Server responded with an error",
    };
  } else if (error.request) {
    // No response received
    return { msg: "No response from server. Please check your connection." };
  } else {
    // Other errors (e.g., request setup issue)
    return { msg: error.message || "Something went wrong" };
  }
}
