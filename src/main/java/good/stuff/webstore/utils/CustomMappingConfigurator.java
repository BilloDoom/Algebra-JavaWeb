package good.stuff.webstore.utils;

import org.modelmapper.ModelMapper;

public interface CustomMappingConfigurator<S, D> {
    void configure(ModelMapper modelMapper);
}
