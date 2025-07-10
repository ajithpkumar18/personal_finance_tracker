
export default function Suggestion({ suggestions }: { suggestions: string[] }) {
    return (
        <>{
            suggestions.map((suggestion, i) => (
                <div key={i} className="w-full bg-gray-800 p-5 sm:text-1 md:text-xl  lg:text-2xl font-bold text-red-600 flex items-center justify-center">⚠️ {suggestion} </div>
            ))
        }
        </>
    )
}
