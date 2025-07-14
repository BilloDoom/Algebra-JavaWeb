package good.stuff.backend.service.product;

import good.stuff.backend.common.model.product.Product;
import good.stuff.backend.common.model.product.ProductImage;
import good.stuff.backend.repository.product.ProductImageRepository;
import good.stuff.backend.repository.product.ProductRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


@Service
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public ProductImageService(ProductImageRepository productImageRepository,
                               ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }

    public ProductImage saveImageUrl(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setProduct(product);

        return productImageRepository.save(image);
    }

    public List<ProductImage> getImagesByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return product.getImages();
    }

    public void deleteImage(Long imageId) {
        productImageRepository.deleteById(imageId);
    }
}