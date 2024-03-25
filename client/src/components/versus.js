import {useState, useRef} from 'react';
import axios from 'axios'
import genRandom from '../utils/dice';

function Versus() {

  const select1 = useRef();
  const select2 = useRef();

  const [imgUrl1, setImgUrl1] = useState('/photos/fieuline/fieuline1.png');
  const [imgUrl2, setImgUrl2] = useState('/photos/jj/avii11.png');
  const [characters, setCharacters] = useState([]);

  const updateImgUrl = async (name1="fieuline", name2="jj") => {
    let res = await axios.get(`/photo/${name1}`, {
      params: {
        currentUrls: [imgUrl1, imgUrl2]
      }
    });
    const newUrl1 = res.data["url"]
    setImgUrl1(newUrl1)
    
    res = await axios.get(`/photo/${name2}`, {
      params: {
        currentUrls: [imgUrl1, imgUrl2],
      }
    });
    const newUrl2 = res.data["url"]
    setImgUrl2(newUrl2)
  }

  const getCharacters = async () => {
    const res = await axios.get('/characters');
    const characters = JSON.parse(res.data["characters"]);
    setCharacters(characters);
  }

  const getRandomImages = () => {
    const index_1 = genRandom(0, characters.length-1);
    let index_2;
    while(true){
      index_2 = genRandom(0, characters.length-1);
      if(index_2 !== index_1){
        break;
      }
    }
    console.log(index_2)

    updateImgUrl(characters[index_1], characters[index_2]);
    select1.current.value = characters[index_1];
    select2.current.value = characters[index_2];
  }

  return (
    <div className="App">
      <div className="vs_container">
        <div className="photo_container">
          <img className="main_image" src={imgUrl1}></img>
          <img className="main_image" src={imgUrl2}></img>
        </div>
        <div className="control_container">
          {
            !characters.length ? 
            <button onClick={() => getCharacters()}>get players</button>
            :
            <>
            <select ref={select1}>
              {
                characters.map(character => {
                  return <option value={character}>{character}</option>
                })
              }
            </select>
            <select ref={select2}>
              {
                characters.map(character => {
                  return <option value={character}>{character}</option>
                })
              }
            </select>
            <button onClick={() => updateImgUrl(select1.current.value, select2.current.value)}>GET</button>
            <button onClick={() => getRandomImages()}>RANDOM</button>
            <section className="output_container">

            </section>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default Versus;
