// import { useEffect, useState } from "react";

// const BotAvatar = () => {
//   const [shake, setShake] = useState(false);

//   useEffect(() => {
//     setShake(true);
//     const timeout = setTimeout(() => setShake(false), 1000);
//     return () => clearTimeout(timeout);
//   }, []);

//   return (
//     <div className="fixed bottom-20 right-5 z-50">
//       <div
//         className={`w-20 h-20 rounded-full bg-gray-100 border-2 border-orange-500 p-1 shadow-xl transition-all ${
//           shake ? "animate-shake" : ""
//         }`}
//       >
//         <img
//           src="/robot.jpg"
//           alt="Bot Avatar"
//           className="w-full h-full rounded-full object-cover"
//           onError={(e) => {
//             e.currentTarget.src =
//               "https://via.placeholder.com/80x80.png?text=Bot"; // fallback image
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default BotAvatar;
