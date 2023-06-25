import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CountryList.css" 


const CountryList = () => {

  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch the list of countries from an API
    axios.get("https://restcountries.com/v2/all?fields=name,region,area").then((response) => {
      const fetchedCountries = response.data.map((country) => ({
        name: country.name,
        region: country.region,
        area: country.area,
      }));
      setCountries(fetchedCountries);

      setFilteredCountries(fetchedCountries);
    });
  }, []);

  useEffect(() => {
    // Apply sorting when sortBy or sortOrder changes
    const sortedCountries = [...filteredCountries].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    });
    setFilteredCountries(sortedCountries);
  }, [sortBy, sortOrder]);

  const handleFilter = () => {
    const filtered = countries.filter((country) => country.area < 65300);
    setFilteredCountries(filtered);
  };

  const handleFilterByOcean = () => {
    const filtered = countries.filter((country) => country.region === "Oceania");
    setFilteredCountries(filtered);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  return (
    <div className="mx-5  ">
      <div>
        <h2 className="text-3xl pt-10 pb-4 tracking-wide font-sans font-bold text-cyan-900 text-center">Country List</h2>
      </div>
      <div className="tracking-wide font-semibold ml-5 my-5">
      <div>
        <label >Countries smaller than Lithuania</label>
        <button  
          className="bg-gray-100 border-2 rounded  px-3 py-1 text-gray-900"
          onClick={handleFilter}
        >Show</button>
      </div>
      <div>
        <label>Countries in Oceania</label>
        <button 
          className="bg-gray-100 border-2 rounded  px-3 py-1 text-gray-900" 
          onClick={handleFilterByOcean}
        >Show</button>
      </div>
      </div>
      <table>
        <thead>
          <tr className="text-slate-600">
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("region")}>Region</th>
            <th onClick={() => handleSort("area")}>Area</th>
          </tr>
        </thead>
        <tbody className="text-slate-500">
          {paginatedCountries.map((country, index) => (
            <tr key={index} >
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tracking-wide font-semibold text-center pt-1">
        <button
          className="bg-gray-100 border-2 rounded  px-3 py-1 text-gray-900"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          className="bg-gray-100 border-2 rounded  px-3 py-1 text-gray-900"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= filteredCountries.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CountryList;
