"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchQuotes } from "../lib/fetchQuotes";
import { motion } from "framer-motion"; 

export default function QuotesPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likes, setLikes] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      loadQuotes();
    }
  }, [isAuthenticated]);

  const loadQuotes = async () => {
    try {
      const data = await fetchQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  const removeQuote = (index) => {
    const updated = [...quotes];
    updated.splice(index, 1);
    setQuotes(updated);
  };

  const clearQuotes = () => {
    setQuotes([]);
  };

  const toggleLike = (quoteId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [quoteId]: prevLikes[quoteId] ? prevLikes[quoteId] + 1 : 1,
    }));
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Quotes</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search quotes..."
          className="p-2 border rounded-lg"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={loadQuotes}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Fetch Quotes
        </button>
        <button
          onClick={clearQuotes}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Clear All
        </button>
      </div>

      <ul className="space-y-4">
        {filteredQuotes.map((quote, index) => (
          <motion.li
            key={`${quote.quote}-${quote.author}-${index}`}
            className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-start"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-lg">{quote.quote}</p>
              <p className="text-sm text-gray-500 mt-2">- {quote.author}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleLike(quote.quote)}
                className="text-blue-500 hover:text-blue-700"
              >
                ❤️ Like {likes[quote.quote] || 0}
              </button>
              <button
                onClick={() => removeQuote(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
