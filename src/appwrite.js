import { Client, Databases, ID, Query } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID

//client basically sets up the connection with appwrite at ** endpoint in ** project (like a handshake)
const client = new Client().setEndpoint("https://sgp.cloud.appwrite.io/v1").setProject(PROJECT_ID)

//allows to perform database operations through the established connection->client
const database = new Databases(client)

//function to update the search count
export const updateSearchCount = async (searchTerm, movie)=>{

    try{
        //tell the path where to look and return documents that match searchTerm
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ])

        //result.documents -> all documents returned from above 
        //if result.documents exists then update count else create new document
        if(result.documents.length > 0){
            const doc = result.documents[0]

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count+1
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm, 
                count:1, 
                movie_id:movie.id, 
                poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            })
        }

    } catch (error) {
        console.log(error);
    }
    
}

//function to get trending movies
export const getTrendingMovies = async () => {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(8), //limiting to only top 5 trending movies
        Query.orderDesc('count') //most popular to least
    ])

    return result.documents
}