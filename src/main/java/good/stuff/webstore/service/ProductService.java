package good.stuff.webstore.service;

import good.stuff.webstore.common.dto.ProductDTO;
import good.stuff.webstore.common.model.Product;
import good.stuff.webstore.repository.ProductRepository;
import good.stuff.webstore.utils.MapperUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product productEntity = MapperUtils.map(productDTO, Product.class);

        Product savedProduct = productRepository.save(productEntity);

        return MapperUtils.map(savedProduct, ProductDTO.class);
    }

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> MapperUtils.map(product, ProductDTO.class))
                .toList();
    }

    public Optional<ProductDTO> getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(p -> MapperUtils.map(p, ProductDTO.class));
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Optional<Product> existingProductOptional = productRepository.findById(id);
        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();

            MapperUtils.mapToExisting(productDTO, existingProduct);

            Product updatedProduct = productRepository.save(existingProduct);

            return MapperUtils.map(updatedProduct, ProductDTO.class);
        }

        return null;
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
