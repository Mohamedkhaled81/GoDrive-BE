import { Pinecone } from '@pinecone-database/pinecone';


const DB_INDEX = 'cars-pricing-egypt';
const EMBEDDING_DIMENSION = 1024;

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })



const embedTextChunks = async (chunks, batchSize= 10)=>{
    try {
        console.log(`🔮 Embedding ${chunks.length} text chunk(s) in batches of ${batchSize}...`);

        const allResults= [];

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);

            const embeddingModel = 'llama-text-embed-v2';

            const embeddings = await pc.inference.embed(
                embeddingModel,
                batch,
                {
                    inputType: 'passage',
                    truncation: 'END'
                }
            );

            const batchResults = batch.map((chunk, index) => ({
                embedding: embeddings[index].values,
                chunk: chunk
            }));

            allResults.push(...batchResults);

            if (i + batchSize < chunks.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`✅ Successfully generated ${allResults.length} embeddings`);
        return allResults;
    } catch (error) {
        console.error('Error embedding text chunks:', error);
        throw new Error('Failed to embed text chunks.');
    }
}
const  storeEmbeddings = async( embeddings, namespace) => {
    try {
        console.log('Storing embeddings in vector database...');

        const index = pc.index(DB_INDEX);
        const vectors = embeddings.map((embedding, i) => ({
            id: `chunk-${i}`,
            values: embedding.embedding,
            metadata: { chunk: embedding.chunk },
        }));

        await index.namespace(namespace).upsert(vectors);
        console.log('Embeddings successfully stored.');
    } catch (error) {
        console.error('Error storing embeddings:', error);
        throw new Error('Failed to store embeddings.');
    }
}


const createIndex = async () => {
    try {
        const indexExists = await checkIndexExists();
        if (indexExists) {
            console.log("Index already exists:", DB_INDEX);
            return;
        }

        await pc.createIndex({
            name: DB_INDEX,
            dimension: EMBEDDING_DIMENSION,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1",
                },
            },
        });
        console.log("Index created:", DB_INDEX);
    } catch (error) {
        console.error('Error creating index:', error);
        throw new Error('Failed to create index.');
    }
};


const checkIndexExists = async () =>  {
    try {
        const response = await pc.listIndexes();
        const indexes = response.indexes || [];
        return indexes.some((item) => item.name === DB_INDEX);
    } catch (error) {
        console.error('Error checking index existence:', error);
        throw new Error('Failed to check index existence.');
    }
}



const retrieveRelevantChunks = async (query, namespace) => {
    try {
        const [embeddingData] = await embedTextChunks([query]);
        const index = pc.index(DB_INDEX);

        const results = await index.namespace(namespace).query({
            vector: embeddingData.embedding,
            topK: 10,
            includeValues: true,
            includeMetadata: true,
        });

        return results.matches.map((match) => match.metadata?.description);
    } catch (error) {
        console.error('Error retrieving relevant chunks:', error);
        throw new Error('Failed to retrieve relevant chunks.');
    }
}
export {
    storeEmbeddings,
    createIndex,
    retrieveRelevantChunks,
    checkIndexExists,
    embedTextChunks
};
