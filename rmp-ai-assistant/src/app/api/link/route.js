import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { load } from 'cheerio';
import OpenAI from "openai";
import fetch from 'node-fetch';


export async function POST(req) {
    const { url } = await req.json();

    try {
        const response = await fetch(url);
        const html = await response.text();

        const $ = load(html);

        const professor = $('div.NameTitle__Name-dowf0z-0').text().trim();
        const rating = $('div.RatingValue__Numerator-qw8sqy-2').text().trim();
        const subject = $('div.NameTitle__Title-dowf0z-1').text().trim();
        let difficulty = $('div.FeedbackItem__FeedbackNumber-uof32n-1').text().trim().slice(3);
        const reviews = $('div.Comments__StyledComments-dzzyvm-0').map((_, el) => $(el).text().trim()).get();

        if (difficulty[0] == '%') {
            difficulty = difficulty.slice(1)
        }


        if (!professor) {
            throw new Error("Failed to scrape professor name");
        }

        const summary = `${professor} is a ${subject || 'Unknown'} and has an overall rating of ${rating || 'N/A'} with a level of difficulty of ${difficulty}. Here are some of their reviews: ${reviews.slice(0, 2).join(' | ')}`;

        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        const index = pc.index("rag").namespace("ns1");
        const openai = new OpenAI();

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: summary,
            encoding_format: "float",
        });

        if (!embedding.data || !embedding.data[0] || !embedding.data[0].embedding) {
            throw new Error("Failed to generate embedding");
        }

        await index.upsert([{
            id: professor,
            values: embedding.data[0].embedding,
            metadata: {
                professor: professor,
                subject: subject || 'Unknown',
                rating: rating || 'N/A',
                review: reviews.join(' ||'),
                difficulty: difficulty || "N/A",
                summary: summary
            }
        }]);


        return NextResponse.json({ message: `${professor} added. Here's a quick summary : ${summary}` });

    } catch (error) {

        console.error('Error processing link:', error);
        return NextResponse.json({ error: "Failed to process the link: " + error.message }, { status: 500 });
    }
}
