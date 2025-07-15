package good.stuff.backend.utils;

import good.stuff.backend.common.dto.product.ProductImageDto;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class ImageXmlUtil {

    public static String toXml(List<ProductImageDto> images) {
        try {
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

            Document doc = docBuilder.newDocument();
            Element rootElement = doc.createElement("imageurls");
            doc.appendChild(rootElement);

            for (ProductImageDto image : images) {
                Element urlElement = doc.createElement("url");
                urlElement.appendChild(doc.createTextNode(image.getImageUrl()));
                rootElement.appendChild(urlElement);
            }

            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(doc), new StreamResult(writer));

            return writer.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error converting images to XML", e);
        }
    }

    public static List<ProductImageDto> fromXml(String xml) {
        List<ProductImageDto> images = new ArrayList<>();
        if (xml == null || xml.isEmpty()) {
            return images;
        }

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            InputSource is = new InputSource(new StringReader(xml));
            Document doc = builder.parse(is);

            NodeList urlNodes = doc.getElementsByTagName("url");
            for (int i = 0; i < urlNodes.getLength(); i++) {
                Node urlNode = urlNodes.item(i);
                String urlText = urlNode.getTextContent();
                images.add(new ProductImageDto(urlText));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing images XML", e);
        }

        return images;
    }

    public static List<String> extractUrlStrings(String xml) {
        if (xml == null || xml.isEmpty()) return List.of();

        List<String> urls = new ArrayList<>();
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));

            NodeList urlNodes = doc.getElementsByTagName("url");
            for (int i = 0; i < urlNodes.getLength(); i++) {
                Node urlNode = urlNodes.item(i);
                String urlText = urlNode.getTextContent();
                if (urlText != null && !urlText.isBlank()) {
                    urls.add(urlText.trim());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return urls;
    }
}