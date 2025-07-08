package good.stuff.backend.service.product;

import good.stuff.backend.common.dto.product.ProductDto;
import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.product.ProductImage;
import good.stuff.backend.repository.CategoryRepository;
import good.stuff.backend.repository.product.ProductImageRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> {
                    ProductDto dto = MapperUtils.map(product, ProductDto.class);
                    if (product.getCategory() != null) {
                        dto.getCategory().setName(product.getCategory().getName());
                    }
                    return dto;
                })
                .toList();
    }

    public Optional<ProductDto> getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(p -> MapperUtils.map(p, ProductDto.class));
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product productEntity = MapperUtils.map(productDto, Product.class);

        Category category = categoryRepository.findById(productDto.getCategory().getId()).orElse(null);
        productEntity.setCategory(category);

        Product savedProduct = productRepository.save(productEntity);

        if (productDto.getImages() != null) {
            savedProduct.getImages().clear();
            savedProduct.getImages().addAll(SaveImages(productDto, savedProduct));
        }

        return MapperUtils.map(productRepository.save(savedProduct), ProductDto.class);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Category category = categoryRepository.findById(productDto.getCategory().getId()).orElse(null);
        product.setCategory(category);

        MapperUtils.mapToExisting(productDto, product);

        if (productDto.getImages() != null) {
            product.getImages().clear();
            product.getImages().addAll(SaveImages(productDto, product));
        }

        return MapperUtils.map(productRepository.save(product), ProductDto.class);
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private List<ProductImage> SaveImages(ProductDto productDto, Product savedProduct) {
        return productDto.getImages().stream()
                .filter(url -> url != null && !url.getImageUrl().trim().isEmpty())
                .map(url -> {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(url.getImageUrl());
                    image.setProduct(savedProduct);
                    return image;
                }).toList();
    }
}
