package good.stuff.backend.utils;

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
import java.util.function.Function;

import org.w3c.dom.*;
import org.xml.sax.InputSource;

public class XmlListUtil {

    public static <T> String toXml(List<T> items, String rootElementName, String itemElementName, Function<T, String> toStringFunction) {
        try {
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

            Document doc = docBuilder.newDocument();
            Element rootElement = doc.createElement(rootElementName);
            doc.appendChild(rootElement);

            for (T item : items) {
                Element itemElement = doc.createElement(itemElementName);
                itemElement.appendChild(doc.createTextNode(toStringFunction.apply(item)));
                rootElement.appendChild(itemElement);
            }

            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");

            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(doc), new StreamResult(writer));

            return writer.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error converting list to XML", e);
        }
    }

    public static <T> List<T> fromXml(String xml, String itemElementName, Function<String, T> fromStringFunction) {
        List<T> items = new ArrayList<>();
        if (xml == null || xml.isEmpty()) {
            return items;
        }

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            InputSource is = new InputSource(new StringReader(xml));
            Document doc = builder.parse(is);

            NodeList nodes = doc.getElementsByTagName(itemElementName);
            for (int i = 0; i < nodes.getLength(); i++) {
                Node node = nodes.item(i);
                String textContent = node.getTextContent();
                items.add(fromStringFunction.apply(textContent));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing XML", e);
        }

        return items;
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