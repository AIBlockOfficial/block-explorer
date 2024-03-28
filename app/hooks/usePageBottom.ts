import { useEffect, useState } from "react"
const triggerPosition = 400
/**
 * Scroll position hook for auto expand of block or txs table
 */
const usePageBottom = () => {
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= triggerPosition;
      setReachedBottom(hasReachedBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return reachedBottom
}

export default usePageBottom