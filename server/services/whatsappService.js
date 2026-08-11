const axios = require("axios");

exports.sendWhatsApp = async (phone, message) => {

    try {

        await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: phone,
                type: "text",
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("WhatsApp Sent");

    } catch (err) {

        console.log(err.response?.data || err.message);

    }

};