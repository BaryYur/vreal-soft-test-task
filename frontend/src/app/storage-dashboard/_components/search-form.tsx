"use client";

import React, { useState } from "react";

import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui";

const searchTypes = [
  {
    id: 1,
    title: "dir",
    value: "directory",
  },
  {
    id: 2,
    title: "file",
    value: "file",
  },
] as const;

export type SearchDataType = "file" | "directory";

interface SearchFormProps {
  onStartSearch: ({
    type,
    name,
  }: {
    type: SearchDataType;
    name: string;
  }) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onStartSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<SearchDataType>(
    searchTypes[0].value,
  );

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onStartSearch({ type: selectedType, name: searchText });
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex items-center">
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="border-r-none focus-visible:ring-none h-10 w-18 rounded-r-none border-r-0 bg-white py-5 focus-visible:ring-0">
          <SelectValue placeholder="By: " />
        </SelectTrigger>
        <SelectContent side="bottom" align="start">
          <SelectGroup>
            <SelectLabel>Select type</SelectLabel>

            {searchTypes.map((searchType) => (
              <SelectItem key={searchType.id} value={searchType.value}>
                {searchType.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input
        placeholder={`Enter ${selectedType} name`}
        className="border-l-none border-r-none focus-visible:ring-none h-[41.6px] w-[350px] rounded-none bg-white focus-visible:ring-0"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <Button className="h-[41.6px] rounded-l-none">Search</Button>
    </form>
  );
};
