const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const WEBFLOW_API_URL = process.env.WEBFLOW_API_URL;
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;

function transliterate(word) {
    const dictionary = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ы': 'y', 
        'э': 'e', 'ю': 'yu', 'я': 'ya',
    };
    
    return word.split('').map(char => dictionary[char] || char).join('');
}

function generateSlug(name) {
    // Транслитерация имени
    const transliteratedName = transliterate(name.toLowerCase());
    
    // Генерация случайной строки
    const randomString = crypto.randomBytes(4).toString('hex');
    
    // Получение текущего времени в формате YYYYMMDDHHMMSS
    const currentDate = new Date().toISOString().replace(/[-:T.\Z]/g, '');
    
    // Создание slug
    const slug = `${transliteratedName}-${currentDate}-${randomString}`.replace(/\s+/g, '-');
    
    return slug;
}

function extractTypeFormData(data) {
    const formId = data.form_response.form_id;
    const answers = data.form_response.answers;

    let firstName = '';
    let review = '';
    let rating = null;

    answers.forEach(answer => {
        switch (answer.field.ref) {
            case 'db688f4d-1370-43e0-bdce-a89bc0f8c0cc':
                rating = answer.number;
                break;
            case '750a8df8-e905-46a1-b823-41a565490030':
                review = answer.text;
                break;
            case 'cc66baf4-9368-42d1-9d9d-d4df5c56f4e0':
                firstName = answer.text;
                break;
        }
    });

    return {
        firstName,    
        review,       
        rating,       
        formId        
    };
}

async function addToWebflowCMS(data) {
    const url = WEBFLOW_API_URL;

    const uniqueSlug = generateSlug(data.firstName);
    const options = {
        method: 'post',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${WEBFLOW_API_TOKEN}`
        },
        data: {
            isArchived: false,
            isDraft: false,
            fieldData: {
                "name": data.firstName,
                "slug": uniqueSlug,
                "imya-klienta": data.firstName,
                "otzyv-2": data.review,
                "ocenka": data.rating,  
            }
        }
    };

    console.log('Sending data to Webflow:', options.data);
    console.log(data);

    try {
        const response = await axios(url, options);
        const responseData = response.data;

        if (response.ok) {
            console.log("Data added to Webflow CMS:", responseData);
        } else {
            console.error("Error adding data to Webflow CMS:", responseData);
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }
    }
}

module.exports = {
    extractTypeFormData,
    addToWebflowCMS
};
