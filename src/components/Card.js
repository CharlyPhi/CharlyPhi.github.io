import React, { useEffect, useState } from "react";
import axios from "axios";

let url =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let url2 = "https://pokeapi.co/api/v2/pokemon-species/";

export default function Card({ pokemon }, { key }) {
  const [src, setSrc] = useState(url + `${pokemon.id}` + ".png");
  const [habitat, setHabitat] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [description, setDescription] = useState([null]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(url2 + `${pokemon.name}`, { signal: controller.signal })
      .then((res) => setHabitat(res.data.habitat.name))
      .then((res) => setDescriptions(res.data.flavor_text_entries))
      .catch((err) => {
        if (axios.isCancel(err)) {
        } else {
          console.log("warning your useEffect is behaving");
        }
      });
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    };
  }, [pokemon]);

  useEffect(() => {
    descriptions.forEach((element) => {
      if (element.language == "en") {
        description.push(element.flavor_text);
      }
    });
  }, [descriptions, description]);

  return (
    <>
      <div className="card" key={key}>
        <div className="top-content">
          <div className="top-left">
            <h2>{pokemon.name}</h2>
          </div>
          <div className="top-right">
            <div className="hp">hp</div>
            <div className="type">type</div>
          </div>
        </div>
        {<img className="Image" src={src} alt={pokemon.name} />}
        <div className="middle-content">
          <div className="id">n°{pokemon.id}</div>
          <div className="weight">{pokemon.weight / 10 + "kg"}</div>
          <div className="height">{pokemon.height / 10 + "m"}</div>
        </div>
        <div className="bottom-content">
          {habitat && <div className="habitat">Lives in {habitat}s</div>}
          {description && <div className="description">{description}</div>}
        </div>
      </div>
    </>
  );
}
