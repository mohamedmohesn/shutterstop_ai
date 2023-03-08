let convert = require("xml-js");
const crypto = require("crypto");
let apiKey = "96346cf4af613d131a41315f52e65dd3";
let photoAPI = "https://opeapi.ws.pho.to/addtask";
let axios = require("axios");
let app_id = "0a23cd010f66c5dfd5b47e0a5b9d6a4e";
const qs = require("querystring");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPhotoByReqId = async (request_id) => {
  const reqAPI = "https://opeapi.ws.pho.to/getresult";
  try {
    let res = await axios.get(reqAPI, {
      params: {
        request_id,
      },
    });
    console.log(res.data);

    const response = convert.xml2js(res.data, { compact: false, spaces: 4 });
    let photoElem = await response.elements[0].elements.find(
      (el) => el.name == "nowm_image_url"
    );
    if (photoElem) {
      return photoElem.elements[0].text;
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const sendDataTOPHO = async (data) => {
  try {
    let cryptoData = crypto
      .createHmac("sha1", apiKey)
      .update(data)
      .digest("hex");

    let requestData = {
      app_id,
      sign_data: cryptoData,
      data,
    };
    const res = await axios.post(photoAPI, qs.stringify(requestData), {
      params: requestData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const response = convert.xml2js(res.data, { compact: true, spaces: 4 });
    console.log(response);
    if (response.image_process_response) {
      let requestId = response.image_process_response.request_id._text;
      await delay(2000);
      let url = await getPhotoByReqId(requestId);
      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }

      await delay(2000);

      url = await getPhotoByReqId(requestId);

      if (typeof url == "string") {
        return url;
      }
    }

    return;
  } catch (error) {
    console.log(error);
  }
};

const filterPhotoService = async ({ body, files, protocol }, host) => {
  try {
    let filterName = body.filterName;
    let template_name = body.template_name;
    let link = body.link;

    let options = { compact: true, ignoreComment: true };

    if ((!files || files.length == 0  && !link )|| !filterName) {
      return {
        error: "No image uploaded or missing filterName",
        status: 400,
      };
    }
    let image;
    if (!(files.length == 0) ) {
      console.log("****");
      let file = files[0];
      const fullUrl = `${protocol}s://${host}/${file.path}`;
      image = fullUrl;
      console.log(fullUrl);
    }

    // let image = "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA18jvW3.img?w=1920&h=1080&q=60&m=2&f=jpg";
    jsonData = {
      image_process_call: {
        image_url: image || link,
        methods_list: {
          method: { name: filterName },
        },
      },
    };

    if (template_name) {
      if (
        !filterName.includes("caricature") &&
        !filterName.includes("animated_eyes")
      ) {
        jsonData.image_process_call.methods_list.method[
          "params"
        ] = `template_name=${template_name}`;
      } else {
        jsonData.image_process_call.methods_list.method[
          "params"
        ] = `type=${template_name}`;
      }
    }
    let result = convert.js2xml(jsonData, options);
    let phAPI = await sendDataTOPHO(result);
    return {
      data: { result, phAPI },
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = filterPhotoService;
