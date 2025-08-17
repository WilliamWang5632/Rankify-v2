export default function Loading({loading}: {loading: boolean}) {
    return(
        <>
            {loading && (
                <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading...</p>
                </div>
            )}
        </>
    )
}