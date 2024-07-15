import OpenAI from 'openai';
import {OPENAI_API_KEY} from './openai.config';

const openai = new OpenAI({ apiKey: `${OPENAI_API_KEY}`, dangerouslyAllowBrowser: true });

const prompt:string = `\n find these details and only return json:
{
    "title": invoice business name or way to identify this, 
    "date": isodatetime,
    "gst": known as: GST or TPS (Goods and Services Tax) amount (if given),
    "pst": known as: PST or TVP or TVQ (Provincial Sales Tax) amount (if given),
    "hst": known as: HST or TVH or (gst + pst) (Harmonized Sales Tax) amount (if given),
    "subtotal": sub total or pre tax amount (if given),
    "total": total amount,
}`


export async function analyzeTextWithAI(text: string): Promise<any> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: `${text} \n ${prompt}` }],
            response_format: { "type": "json_object" },
            model: 'gpt-3.5-turbo',
        });
        console.log(completion);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing text with OpenAI:', error);
        throw error;
    }
}
