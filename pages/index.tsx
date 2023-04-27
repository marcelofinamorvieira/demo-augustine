import { Image } from "react-datocms/image";
import { StructuredText } from "react-datocms/structured-text";

export async function getStaticProps() {
  const token = "THE-API-TOKEN-FOR-THAT-PROJECT";

  const response = await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `{ article(filter: {id: {eq: "133477939"}}) { content { value blocks { __typename id image { id responsiveImage { srcSet webpSrcSet sizes src width height aspectRatio alt title base64 } } } } } }`,
    }),
  });

  const parsedResponse = await response.json();

  return { props: { queryResponse: parsedResponse } };
}

export default function Home(props: any) {
  console.log(props.queryResponse.data.article.content);
  return (
    <StructuredText
      data={props.queryResponse.data.article.content}
      renderBlock={({ record }) => {
        console.log(record);
        if (record.__typename === "ImageRecord") {
          return <Image data={(record.image as any).responsiveImage} />;
        }

        return (
          <>
            <p>Don't know how to render a block!</p>
            <pre>{JSON.stringify(record, null, 2)}</pre>
          </>
        );
      }}
    />
  );
}
