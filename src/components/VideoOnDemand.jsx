import React, { useState, useEffect } from "react"; // , { useState }
import { restCallToBackendAsync } from "./helpers"

import { useVisible } from 'react-hooks-visible'


export const VideoOnDemand = ({ folder, item, className }) => {

  const endpoint = " https://srxdhyyhm2.execute-api.eu-central-1.amazonaws.com/dev/photoData"

  const [surl, setSUrl] = useState("")

  const url = [endpoint, folder, item, "raw"].join("/")

  useEffect(() => {
      // const signed_url = ""
      restCallToBackendAsync(url).then(data => {
          console.log( "signed_url", data )
          setSUrl(data.presigned_url)
      })
  }, [item]);


  return (
      <>
          {surl &&
              <video className={className} controls style={ { backgroundColor: "#2D2D31", width: "100%" } } preload="metadata" muted>
                  <source src={surl} type="video/mp4" />
              </video>
          }
      </>
 
  )

  // <p>{signed_url}</p>

}