import { Icons } from "@/components/icons";

export const EXAMPLE_PAGES = [
  {
    title: "Fields Extraction",
    href: "/fields-extraction",
    description: "Extract fields from documents using natural language.",
    icon: Icons.text,
    code: {
      workflowSchema: `{
  "input": {
    "document": {
      "desc": "Document to extract fields from",
      "name": "Document",
      "type": "file",
      "order": 0,
      "extract_images": true,
      "extract_contents": true
    },
    "fields_to_extract": {
      "desc": "Describe what information you want to extract from the document in natural language. For example:\n- Extract the person's name, date of birth, and address\n- Find all account numbers and transaction dates\n- Get the invoice number, total amount, and customer details",
      "name": "Fields to Extract",
      "type": "string",
      "order": 1,
      "multiline": true
    }
  },
  "input_default": {},
  "steps": [
    {
      "key": "MODEL_PARSE_SCHEMA",
      "size": [
        540,
        200
      ],
      "type": "model",
      "position": [
        800,
        0
      ],
      "provider": {
        "model": "openai",
        "messages": [
          {
            "role": "system",
            "content": "You are an expert at parsing natural language requests for data extraction. Convert the user's field request into a structured list of field names. Return ONLY a JSON object with a 'fields' array containing the requested field names.\n\nRules:\n- If user specifies an exact key (e.g. employee_id, account-number), preserve it exactly\n- Only convert to camelCase when the field has spaces and no explicit key\n- Examples:\n  \"get employee_id and employee name\" -> [\"employee_id\", \"employeeName\"]\n  \"Extract Account_Number and Full Name\" -> [\"Account_Number\", \"fullName\"]\n  \"Find account_balance and Person Address\" -> [\"account_balance\", \"personAddress\"]\n\nDo NOT convert explicitly formatted keys. Only convert spaces to camelCase when no specific format is given."
          },
          {
            "role": "user",
            "content": [
              {
                "text": "Extract these fields: {{input.fields_to_extract}}\n\nConvert this request into a clean list of field names. Only convert spaces to camelCase when no explicit key format is provided.",
                "type": "text"
              }
            ]
          }
        ],
        "provider": "text",
        "temperature": 0.1,
        "response_format": "json"
      },
      "destinations": [
        "MODEL_EXTRACT"
      ],
      "input_connected": true
    },
    {
      "key": "MODEL_EXTRACT",
      "size": [
        540,
        200
      ],
      "type": "model",
      "position": [
        1440,
        0
      ],
      "provider": {
        "model": "openai",
        "messages": [
          {
            "role": "system",
            "content": "You are an expert at extracting structured information from documents. Extract ONLY the fields specified in the schema. Return a clean JSON object with exactly the requested fields."
          },
          {
            "role": "user",
            "content": [
              {
                "text": "Extract these fields from the document: {{MODEL_PARSE_SCHEMA.output.message.fields}}\n\nDocument contents:\n{{input.document:contents}}\n\nDocument images:\n{{input.document:images}}\n\nReturn ONLY these exact fields, with null for any fields not found. Format as clean JSON.",
                "type": "text"
              }
            ]
          }
        ],
        "provider": "text",
        "temperature": 0.2,
        "response_format": "json"
      },
      "destinations": [
        "CODE_RESULT"
      ]
    },
    {
      "key": "CODE_RESULT",
      "code": "return {\n  result: MODEL_EXTRACT.output.message,\n};",
      "size": [
        500,
        200
      ],
      "type": "code",
      "position": [
        2040,
        0
      ],
      "destinations": []
    }
  ]
}`,
      callCode: `const url = 'https://api.withcortex.ai/apps/{app_id}/workflows/{workflow_id}/runs';

const options = {
  method: 'POST',
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "input": {
      "fields_to_extract": "Get the invoice_number, total_amount, and customer_details",
      "document": "https://example.com/invoice.pdf"
    },
    "workflow_version_id": "draft",
    "stream": false
  }),
};

const response = await fetch(url, options);
const data = await response.json();
const extractedFields = data.result;
console.log(extractedFields); // {invoice_number: '123456', total_amount: '1000', customer_details: 'John Doe'}`,
    },
  },
  {
    title: "Image Analysis",
    href: "/image-analysis",
    description:
      "Analyze images and get detailed answers to your questions about them.",
    icon: Icons.image,
    code: {
      workflowSchema: `{
  "input": {
    "image": {
      "desc": "Upload an image to analyze",
      "name": "Image",
      "type": "file",
      "order": 0,
      "extract_images": true
    },
    "question": {
      "desc": "Ask a question about the image",
      "name": "Question About Image",
      "type": "string",
      "order": 1,
      "placeholder": "Example: What is happening in this image?"
    }
  },
  "input_default": {},
  "steps": [
    {
      "key": "MODEL_ANALYZE",
      "size": [
        540,
        200
      ],
      "type": "model",
      "position": [
        800,
        0
      ],
      "provider": {
        "model": "openai",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant that answers questions about images in a natural, conversational way. Provide clear, direct responses without technical analysis."
          },
          {
            "role": "user",
            "content": "Here is an image: {{input.image:images}}\n\nPlease answer this question: {{input.question}}"
          }
        ],
        "provider": "text",
        "temperature": 0.3,
        "response_format": "text"
      },
      "destinations": [
        "CODE_RESULT"
      ],
      "input_connected": true
    },
    {
      "key": "CODE_RESULT",
      "code": "return {\n  result: MODEL_ANALYZE.output.message\n};",
      "size": [
        500,
        200
      ],
      "type": "code",
      "position": [
        1440,
        0
      ],
      "destinations": []
    }
  ]
}`,
      callCode: `const url = 'https://api.withcortex.ai/apps/{app_id}/workflows/{workflow_id}/runs';

const options = {
  method: 'POST',
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "input": {
      "question": "What is happening in this image?",
      "image": "https://example.com/image.jpg"
    },
    "workflow_version_id": "draft",
    "stream": false
  }),
};

const response = await fetch(url, options);
const data = await response.json();
const answer = data.result;
console.log(answer); // "There is a person in the image."`,
    },
  },
];

export type ExamplePage = (typeof EXAMPLE_PAGES)[number];
