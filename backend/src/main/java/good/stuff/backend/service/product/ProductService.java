package good.stuff.backend.service.product;

import good.stuff.backend.common.dto.product.ProductDto;
import good.stuff.backend.common.dto.product.ProductImageDto;
import good.stuff.backend.common.model.category.Category;
import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.repository.CategoryRepository;
import good.stuff.backend.repository.product.ProductRepository;
import good.stuff.backend.utils.ImageXmlUtil;
import good.stuff.backend.utils.MapperUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::toDto)
                .toList();
    }

    public List<ProductDto> getFilteredProducts(Long categoryId, Double priceMin, Double priceMax) {
        List<Product> filtered = productRepository.findFiltered(categoryId, priceMin, priceMax);
        return filtered.stream()
                .map(this::toDto)
                .toList();
    }

    public Optional<ProductDto> getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(this::toDto);
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product productEntity = MapperUtils.map(productDto, Product.class);

        Category category = null;
        if (productDto.getCategory() != null && productDto.getCategory().getId() != null) {
            category = categoryRepository.findById(productDto.getCategory().getId()).orElse(null);
        }
        productEntity.setCategory(category);

        productEntity.setImageUrls(ImageXmlUtil.toXml(productDto.getImages()));

        Product savedProduct = productRepository.save(productEntity);
        return toDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Category category = null;
        if (productDto.getCategory() != null && productDto.getCategory().getId() != null) {
            category = categoryRepository.findById(productDto.getCategory().getId()).orElse(null);
        }
        product.setCategory(category);

        MapperUtils.mapToExisting(productDto, product);

        product.setImageUrls(ImageXmlUtil.toXml(productDto.getImages()));

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<String> getProductImageUrls(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        return ImageXmlUtil.extractUrlStrings(product.getImageUrls());
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = MapperUtils.map(product, ProductDto.class);

        if (product.getCategory() != null) {
            dto.setCategory(MapperUtils.map(product.getCategory(), dto.getCategory() != null ? dto.getCategory().getClass() : null));
            dto.getCategory().setName(product.getCategory().getName());
        }

        List<ProductImageDto> images = ImageXmlUtil.fromXml(product.getImageUrls());
        dto.setImages(images);

        return dto;
    }

    @Transactional
    public ProductDto updateProductImages(Long productId, List<String> imageUrls) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        List<ProductImageDto> images = new ArrayList<>();
        imageUrls.forEach(imageUrl -> {
            images.add(new ProductImageDto(imageUrl));
        });

        String xmlImageUrls = ImageXmlUtil.toXml(images);
        product.setImageUrls(xmlImageUrls);

        Product saved = productRepository.save(product);

        return MapperUtils.map(saved, ProductDto.class);
    }

}
