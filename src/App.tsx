import useRating from "./hooks/useRating";
import AlertMessages from "./components/alerts";
import Header from "./components/header";
import Collection from "./components/collection";

export default function App() {
  const {
    error,
    success,  
  } = useRating()

  return (
    <div className="min-h-screen w-[100vw] bg-gray-900 text-white">
      <div className="max-w-full mx-auto px-8 py-2">
        {/* Header */}
        <Header/>

        {/* Messages */}
        <AlertMessages error={error} success={success}/>

        <Collection/>
      </div>
    </div>
  );
}


